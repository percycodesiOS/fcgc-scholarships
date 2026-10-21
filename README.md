# FCGC Scholarships

Review preview of the Fox Chapel Golf Club Scholarship Foundation's 2027 application website. The online format is pending Foundation approval; the editable document packet can be used independently.

**Website:** https://percycodesios.github.io/fcgc-scholarships/

Applicants complete the form in a modern browser, see costs and grants total automatically, and download a PDF with the totals already printed. Optional PDF, JPG, and PNG supporting files can be combined into the packet on the applicant's device. A JSON draft can be downloaded and reopened later; supporting files must be selected again.

## Submission and privacy

This is a static website. It does not collect applications, send email, or provide an application inbox. Answers and selected files are processed in the browser. Downloading a packet does not submit it. Follow the Foundation's current signature and delivery instructions in the form and cover letter. Keep digitally signed originals separate.

Only the public website, blank application templates, and bundled PDF library belong in this repository. Never commit completed applications, saved drafts, applicant attachments, credentials, or private administrative records.

## Hosting

GitHub Pages deploys the `main` branch from `/ (root)`. All website resources use relative paths, so the project URL works without a custom domain, local server, or tunnel. No build step or paid service is required.

For local review, serve this directory with a static web server (for example, `python -m http.server 8080`) and open `http://localhost:8080`. PDF creation fetches the local templates, so opening `index.html` directly as a file is not supported.

## Files

- `index.html`, `style.css`: responsive form and instructions
- `app.js`: fields, currency calculations, saved drafts, and completed PDF creation
- `attachments.js`: local supporting-document validation and PDF merging
- `application.pdf`, `cover-letter.pdf`, `packet-blank.pdf`: current blank public documents
- `pdf-lib.min.js`: bundled PDF library; license in `pdf-lib-LICENSE.md`

Use the web form for reliable automatic totals. PDF viewers differ in support for embedded calculation scripts; the completed PDF has fixed printed totals and does not require those scripts.
