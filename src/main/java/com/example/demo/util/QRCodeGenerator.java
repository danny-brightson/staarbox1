package com.example.demo.util;

import java.io.ByteArrayOutputStream;
import java.io.OutputStream;
import java.util.List;

import org.springframework.stereotype.Component;

import com.example.demo.QrCodeProjection;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Div;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.property.HorizontalAlignment;
import com.itextpdf.layout.property.TextAlignment;
import com.itextpdf.layout.property.UnitValue;
import com.itextpdf.layout.property.VerticalAlignment;
@Component
public class QRCodeGenerator {

    public static byte[] generateQRCode(String text, int width, int height) throws Exception {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);

        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
        return pngOutputStream.toByteArray(); // Save to DB or disk
    }
    
//    public  void generateQrPrintPdf(List<QrCodeProjection> qrDataList, String outputPath) throws Exception {
//        PdfWriter writer = new PdfWriter(outputPath);
//        PdfDocument pdfDoc = new PdfDocument(writer);
//        Document document = new Document(pdfDoc);
//
//        // Create a table with 3 columns and use full available width
//        Table table = new Table(UnitValue.createPercentArray(3)).useAllAvailableWidth();
//
//        int columnCount = 3;
//        int count = 0;
//
//        for (QrCodeProjection row : qrDataList) {
//            byte[] qrCodeBytes = row.getQrCode();
//            String numberCode = row.getNumberCode();
//
//            Image qrImage = new Image(ImageDataFactory.create(qrCodeBytes))
//                .setWidth(100)
//                .setHeight(100);
//            Paragraph codeText = new Paragraph(numberCode)
//                .setFontSize(10)
//                .setTextAlignment(TextAlignment.CENTER);
//
//            Div cellContent = new Div().add(qrImage).add(codeText);
//
//            table.addCell(new Cell()
//                .add(cellContent)
//                .setPadding(10)
//                .setTextAlignment(TextAlignment.CENTER));
//
//            count++;
//        }
//
//        // Add empty cells if the last row has less than 3 cells
//        int remainingCells = columnCount - (count % columnCount);
//        if (remainingCells < columnCount) {
//            for (int i = 0; i < remainingCells; i++) {
//                table.addCell(new Cell().add(new Paragraph("")).setPadding(10));
//            }
//        }
//
//        document.add(table);
//        document.close();
//    }
    
//    public static void generateQrPrintPdf(List<QrCodeProjection> qrDataList, OutputStream outputStream) throws Exception {
//        PdfWriter writer = new PdfWriter(outputStream);
//        PdfDocument pdfDoc = new PdfDocument(writer);
//        Document document = new Document(pdfDoc);
//
//        Table table = new Table(UnitValue.createPercentArray(3)).useAllAvailableWidth();
//
//        for (QrCodeProjection row : qrDataList) {
//            byte[] qrCodeBytes = row.getQrCode();
//            String numberCode = row.getNumberCode();
//
//            Image qrImage = new Image(ImageDataFactory.create(qrCodeBytes)).setWidth(100).setHeight(100);
//            Paragraph codeText = new Paragraph(numberCode).setFontSize(10).setTextAlignment(TextAlignment.CENTER);
//            Div cellContent = new Div().add(qrImage).add(codeText);
//
//            table.addCell(new Cell().add(cellContent).setPadding(10).setTextAlignment(TextAlignment.CENTER));
//        }
//
//        document.add(table);
//        document.close();
//    }
    
    public static void generateQrPrintPdf(List<QrCodeProjection> qrDataList, OutputStream outputStream) throws Exception {
        PdfWriter writer = new PdfWriter(outputStream);
        PdfDocument pdfDoc = new PdfDocument(writer);
        Document document = new Document(pdfDoc);

        Table table = new Table(UnitValue.createPercentArray(3)).useAllAvailableWidth();

        for (QrCodeProjection row : qrDataList) {
            byte[] qrCodeBytes = row.getQrCode();
            String numberCode = row.getNumberCode();

            // Create QR image
            Image qrImage = new Image(ImageDataFactory.create(qrCodeBytes))
                    .setWidth(100)
                    .setHeight(100)
                    .setHorizontalAlignment(HorizontalAlignment.CENTER);

            // Create number text
            Paragraph codeText = new Paragraph(numberCode)
                    .setFontSize(10)
                    .setTextAlignment(TextAlignment.CENTER);

            // Create vertical layout using a Div
            Div verticalBox = new Div()
                    .setTextAlignment(TextAlignment.CENTER)
                    .setHorizontalAlignment(HorizontalAlignment.CENTER)
                    .add(qrImage)
                    .add(codeText);

            // Add to cell with padding and full center alignment
            Cell cell = new Cell()
                    .add(verticalBox)
                    .setPadding(10)
                    .setVerticalAlignment(VerticalAlignment.MIDDLE)
                    .setTextAlignment(TextAlignment.CENTER);

            table.addCell(cell);
        }

        document.add(table);
        document.close();
    }



}

