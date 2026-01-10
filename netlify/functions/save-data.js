const { Octokit } = require("@octokit/rest");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Nur POST erlaubt" };

  // Der Token kommt sicher aus dem Netlify-Tresor
  const octokit = new Octokit({ auth: process.env.GH_TOKEN });
  const { path, content, message } = JSON.parse(event.body);

  try {
    // 1. SHA der existierenden Datei holen (wichtig für GitHub Updates)
    const { data } = await octokit.repos.getContent({
      owner: "DeepBlue-92", // <-- Deinen Namen eintragen (z.B. der Name vor /svneuhausen1947)
      repo: "svneuhausen1947",       // <-- Dein Repo-Name
      path: path,
    });

    // 2. Datei mit neuem Inhalt überschreiben
    await octokit.repos.createOrUpdateFileContents({
      owner: "DeepBlue-92", // <-- Deinen Namen eintragen
      repo: "svneuhausen1947",
      path: path,
      message: message || "Update via Admin-Panel",
      content: Buffer.from(content).toString("base64"),
      sha: data.sha,
    });

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
