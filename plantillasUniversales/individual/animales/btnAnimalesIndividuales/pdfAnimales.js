// btnPDFAnimales.js

document.getElementById("btnPDFAnimales").onclick = () => {

    const columnas = Array.from(
        document.querySelectorAll(".tablaContenido thead th")
    ).map(th => th.textContent.trim());

    const filas = Array.from(
        document.querySelectorAll(".listadoRegistrosTabla tr")
    ).map(tr => Array.from(tr.children).map(td => td.textContent.trim()));

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "a4"
    });

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Listado completo de animales adultos", 40, 40);

    const fecha = new Date().toLocaleString();
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generado: ${fecha}`, 40, 60);

    doc.autoTable({
        head: [columnas],
        body: filas,
        startY: 80,
        styles: { fontSize: 9, cellPadding: 4, halign: "center", valign: "middle" },
        headStyles: { fillColor: [34, 139, 34], textColor: 255, fontStyle: "bold" },
        alternateRowStyles: { fillColor: [240, 240, 240] },
        margin: { left: 40, right: 40 }
    });

    doc.save("Listado_animales_adultos.pdf");
};
