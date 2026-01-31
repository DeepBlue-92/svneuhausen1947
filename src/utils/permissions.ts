
import { User } from '../types';

/**
 * Checks if a user has permission to edit a specific department.
 * Admin has access to everything ('all' or specific).
 * Heads only have access if the target matches their departmentId.
 */
export function checkAccess(user: User, targetDepartmentId: string): boolean {
    if (!user || !user.role) return false;

    // Admin has access to everything
    if (user.role === 'admin') return true;

    // Department Head Logic
    if (user.role === 'head') {
        // A head can only edit their own department
        return user.departmentId === targetDepartmentId;
    }

    return false;
}

/**
 * Validates if a user can create content for a selected department.
 */
export function canCreateForDepartment(user: User, selectedDepartmentId: string): boolean {
    if (user.role === 'admin') return true;
    if (user.role === 'head' && user.departmentId === selectedDepartmentId) return true;
    return false;
}
