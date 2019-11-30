define({ "api": [
  {
    "type": "get",
    "url": "/v1",
    "title": "Shows routes on the api endpoint.",
    "description": "<p>Shows routes on the api endpoint.</p>",
    "version": "1.0.0",
    "name": "Endpoints",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "object",
            "description": "<p>Available routes</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Unauthorized 401": [
          {
            "group": "Unauthorized 401",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated Users can access the data</p>"
          }
        ]
      }
    },
    "filename": "src/routes/api/v1/index.js",
    "group": "_mnt_c_Users_mrdem_Documents_Projects_personal_share_mrdemonwolf_me_src_routes_api_v1_index_js",
    "groupTitle": "_mnt_c_Users_mrdem_Documents_Projects_personal_share_mrdemonwolf_me_src_routes_api_v1_index_js"
  }
] });
