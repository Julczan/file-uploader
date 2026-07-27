-- @param {String} $1:organisationId
WITH RECURSIVE parentFolder AS (
  SELECT 
    id
  FROM 
    "Folder"
  WHERE 
    id = $1
  UNION 
  SELECT 
    childFolder.id
  FROM 
     "Folder" childFolder
    INNER JOIN parentFolder pf ON pf.id = childFolder."parentFolderId"
) 
SELECT * FROM parentFolder;