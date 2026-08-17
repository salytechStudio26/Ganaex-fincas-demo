document.getElementById("btnPDFAnimales").onclick = () => {

    // Obtener columnas reales (incluye columnas nuevas)
    const columnas = Array.from(
        document.querySelectorAll(".tablaContenido thead th")
    ).map(th => th.textContent.trim());

    // Obtener filas reales
    const filas = Array.from(
        document.querySelectorAll(".listadoRegistrosTabla tr")
    ).map(tr => Array.from(tr.children).map(td => td.textContent.trim()));

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "a4"
    });

    // Título
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Listado completo de lotes de animales", 40, 40);

    // Fecha
    const fecha = new Date().toLocaleString();
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generado: ${fecha}`, 40, 60);

    // Tabla
    doc.autoTable({
        head: [columnas],
        body: filas,
        startY: 80,
        styles: { fontSize: 9, cellPadding: 4, halign: "center", valign: "middle" },
        headStyles: { fillColor: [34, 139, 34], textColor: 255, fontStyle: "bold" },
        alternateRowStyles: { fillColor: [240, 240, 240] },
        margin: { left: 40, right: 40 }
    });

    // Guardar PDF
    doc.save("Listado_lotes_animales.pdf");
};
