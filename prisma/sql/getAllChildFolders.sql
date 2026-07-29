-- @param {String} $1:organisationId
WITH RECURSIVE parentFolder AS (
  SELECT 
    id, title
  FROM 
    "Folder"
  WHERE 
    id = $1
  UNION 
  SELECT 
    childFolder.id, childFolder.title
  FROM 
     "Folder" childFolder
    INNER JOIN parentFolder pf ON pf.id = childFolder."parentFolderId"
) 
SELECT title FROM parentFolder;