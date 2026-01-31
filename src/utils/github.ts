import { User, Role, PermissionConfig } from '../types';

// CONFIGURATION
export const REPO_OWNER = 'DeepBlue-92';
export const REPO_NAME = 'svneuhausen1947';
export const BRANCH = 'main';

// 1. RBAC CHECK FUNCTION
export function checkAccess(user: User, target: string): boolean {
    if (!user || !user.role) return false;
    if (user.role === 'admin') return true;
    if (user.role === 'head') {
        if (!target.includes('/')) {
            return user.departmentId === target;
        }
        const pathParts = target.split('/');
        if (pathParts.length > 1) {
            const pathDept = pathParts[1];
            return user.departmentId === pathDept;
        }
    }
    return false;
}

// 2. DATA LOADER
export async function fetchData(filename: string, folder: string = 'public/data'): Promise<any | null> {
    try {
        // Construct raw URL with folder and timestamp for cache busting
        const url = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}/${folder}/${filename}?t=${Date.now()}`;
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) return null;
        return await response.json();
    } catch (e) {
        console.error(`Failed to fetch ${filename}`, e);
        return null;
    }
}

// 3. GITHUB API WRAPPER
export async function pushToGitHub(
    user: User, 
    path: string, 
    content: string, 
    message: string,
    isBase64Image: boolean = false
): Promise<{ success: boolean; message: string }> {
    
    if (!user.accessToken) {
        return { success: false, message: "Kein GitHub Token gefunden. Bitte im Dashboard eintragen." };
    }

    try {
        // 1. Get current file SHA
        let sha: string | undefined;
        try {
            const getRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`, {
                headers: { 
                    Authorization: `Bearer ${user.accessToken}`,
                    Accept: "application/vnd.github.v3+json"
                }
            });
            if (getRes.ok) {
                const data = await getRes.json();
                sha = data.sha;
            }
        } catch (e) {
            // File doesn't exist yet
        }

        // 2. Prepare content
        // If it's an image/pdf (binary), we assume content is the base64 string.
        // We must strip the data URI prefix (e.g. "data:application/pdf;base64,") if present.
        let finalContent = content;
        
        if (isBase64Image) {
            if (finalContent.includes('base64,')) {
                finalContent = finalContent.split('base64,')[1];
            }
        } else {
            // Text content -> Base64 encoding needed for GitHub API
            // Using unescape(encodeURIComponent()) handles UTF-8 characters correctly
            finalContent = btoa(unescape(encodeURIComponent(content)));
        }

        // 3. Create/Update File
        const putRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${user.accessToken}`,
                Accept: "application/vnd.github.v3+json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message,
                content: finalContent,
                sha: sha,
                branch: BRANCH
            })
        });

        if (!putRes.ok) {
            const err = await putRes.json();
            throw new Error(err.message || "GitHub API Error");
        }

        return { success: true, message: "Gespeichert." };

    } catch (error: any) {
        console.error(error);
        return { success: false, message: `Fehler: ${error.message}` };
    }
}