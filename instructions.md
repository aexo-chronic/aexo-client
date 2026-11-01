# Start the aexo Client

This project is a browser-based launcher shell for a verified Eaglercraft 26.3 source/build.

## Local run instructions

1. Open the project folder in a browser, or serve it locally from the repository root.
2. If you want to run it from a local web server, use one of the following:

   Python:
   python -m http.server 8000

   Then open:
   http://localhost:8000/

3. If you are just opening the file directly:
   - open `index.html` in a browser
   - make sure all static assets load from the same directory

## Notes

- The current project is a launcher/UI shell only.
- It does not include a verified Eaglercraft 26.3 game source or approved hosted build yet.
- Before connecting a game build or play URL, verify the upstream source, license, and redistribution permissions.

## Troubleshooting

- If the page looks blank or unstyled, make sure `index.html`, `style.css`, and `app.js` are all present in the same folder.
- If the browser blocks local file behavior, use a simple local web server instead of opening the file directly.
