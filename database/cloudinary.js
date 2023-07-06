const cloudinary = require('cloudinary').v2

cloudinary.config({ 
  cloud_name: 'dcjartbop', 
  api_key: '271128193193264', 
  api_secret: 'CkZmD4o6KnSEcm5efL6b4gaU1Kk' 
});

  module.exports = cloudinary