
package com.resumeai.service;

import java.io.InputStream;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;

import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ResumeTextExtractor {

    public String extractText(MultipartFile file) throws Exception {

        String fileName = file.getOriginalFilename();

        if (fileName == null) {
            throw new IllegalArgumentException("Invalid file name");
        }

        String lowerName = fileName.toLowerCase();

        if (lowerName.endsWith(".pdf")) {

            try (PDDocument document =
                    Loader.loadPDF(file.getBytes())) {

                PDFTextStripper stripper = new PDFTextStripper();

                return stripper.getText(document);
            }

        } else if (lowerName.endsWith(".docx")) {

            try (InputStream input = file.getInputStream();
                 XWPFDocument document = new XWPFDocument(input);
                 XWPFWordExtractor extractor =
                         new XWPFWordExtractor(document)) {

                return extractor.getText();
            }

        } else {
            throw new IllegalArgumentException(
                    "Only PDF and DOCX files are supported");
        }
    }
}
