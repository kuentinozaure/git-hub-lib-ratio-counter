/**
 * This function is used to extract the total number of open and closed issues
 * @param {string} repoName - Name of the repository
 * @param {string} linkHeader - Link header from the response
 * @param {boolean} isOpen - Flag to check if the issue is open or closed
 */
export async function extractTotalCount(repoName, linkHeader, openedIssue) {
  const match = linkHeader.match(/<([^>]+)>; rel="last"/)[1].split("&page=");
  const stateOfUrl = openedIssue ? "open" : "closed";
  try {
    const response = await fetch(
      `https://api.github.com/repos/${repoName}/issues?state=${stateOfUrl}&page=${match[1]}&per_page=100`
    );
    const data = await response.json();
    return Promise.resolve((match[1] - 1) * 100 + data.length);
  } catch (error) {
    return Promise.reject(error);
  }
}
