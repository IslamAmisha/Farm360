package com.Farm360.controller.upload;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/uploads")
public class FileUploadController {

    @PostMapping
    public ResponseEntity<Map<String, String>> upload(
            @RequestParam("file") MultipartFile file) throws IOException {

        String uploadDir = "uploads/";
        new java.io.File(uploadDir).mkdirs();
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        java.nio.file.Files.write(
                java.nio.file.Paths.get(uploadDir + fileName),
                file.getBytes()
        );
        return ResponseEntity.ok(Map.of("url", "/" + uploadDir + fileName));
    }
}
