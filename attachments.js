'use strict';

// Files are read and combined on the applicant's device, never uploaded.
function validateAttachments(files) {
  if (files.length > 8) throw new Error('Choose up to eight supporting files.');
  let total = 0;
  for (const file of files) {
    if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
      throw new Error('Supporting files must be PDF, JPG, or PNG.');
    }
    total += file.size;
    if (file.size > 5000000 || total > 15000000) {
      throw new Error('Keep each supporting file under 5 MB and all supporting files under 15 MB.');
    }
  }
}

async function appendAttachments(bytes, files) {
  validateAttachments(files);
  if (!files.length) return bytes;
  const { PDFDocument, PDFName } = PDFLib;
  const packet = await PDFDocument.load(bytes);
  for (const file of files) {
    const buffer = await file.arrayBuffer();
    if (file.type === 'application/pdf') {
      let source;
      try { source = await PDFDocument.load(buffer); }
      catch { throw new Error(`Could not read ${file.name}. Use an unlocked PDF, JPG, or PNG.`); }
      if (source.getPageCount() > 30) throw new Error('Each supporting PDF may contain up to 30 pages.');
      const form = source.getForm();
      if (form.getFields().some(field => field instanceof PDFLib.PDFSignature)) {
        throw new Error(`Keep the original signed file ${file.name} separate so its digital signature is preserved. Remove it here and include it when you submit.`);
      }
      if (form.getFields().length) form.flatten();
      for (const page of source.getPages()) page.node.delete(PDFName.of('Annots'));
      for (const page of await packet.copyPages(source, source.getPageIndices())) packet.addPage(page);
    } else {
      let picture;
      try { picture = file.type === 'image/png' ? await packet.embedPng(buffer) : await packet.embedJpg(buffer); }
      catch { throw new Error(`Could not read ${file.name}. Choose a valid JPG or PNG image.`); }
      const size = picture.scaleToFit(540, 720);
      const page = packet.addPage([612, 792]);
      page.drawImage(picture, { x: (612 - size.width) / 2, y: (792 - size.height) / 2, ...size });
    }
    if (packet.getPageCount() > 100) throw new Error('The completed packet may contain up to 100 pages.');
  }
  return packet.save();
}

const supportingFiles = document.getElementById('supportingFiles');
function describeAttachments() {
  const files = Array.from(supportingFiles.files);
  const status = document.getElementById('attachmentStatus');
  try {
    validateAttachments(files);
    status.className = 'small';
    status.textContent = files.length ? `${files.length} file(s) selected: ${files.map(file => file.name).join('; ')}. They will follow your application in the downloaded packet.` : 'No supporting files selected. You can also submit them separately with your signed application.';
  } catch (error) {
    status.className = 'error';
    status.textContent = error.message;
  }
  document.getElementById('clearAttachments').hidden = !files.length;
  document.getElementById('downloadReady').hidden = true;
}
supportingFiles.addEventListener('change', describeAttachments);
document.getElementById('clearAttachments').addEventListener('click', () => {
  supportingFiles.value = '';
  describeAttachments();
});
