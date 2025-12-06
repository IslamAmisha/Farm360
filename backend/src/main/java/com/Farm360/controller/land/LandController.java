package com.Farm360.controller.land;

import com.Farm360.dto.request.land.LandRQ;
import com.Farm360.dto.request.land.LandUpdateRQ;
import com.Farm360.dto.response.land.LandRS;
import com.Farm360.service.land.LandService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/farmers/{farmerId}/lands")
public class LandController {

    @Autowired
    private LandService landService;

    @PostMapping
    public ResponseEntity<LandRS> createLand(
            @PathVariable Long farmerId,
            @RequestBody LandRQ rq
    ) {
        LandRS rs = landService.createLand(farmerId, rq);
        return ResponseEntity.ok(rs);
    }

    @GetMapping
    public ResponseEntity<List<LandRS>> getLandsByFarmer(@PathVariable Long farmerId) {
        List<LandRS> lands = landService.getLandsByFarmer(farmerId);
        return ResponseEntity.ok(lands);
    }

    @PutMapping("/{landId}")
    public ResponseEntity<LandRS> updateLand(
            @PathVariable Long farmerId,
            @PathVariable Long landId,
            @RequestBody LandUpdateRQ rq
    ) {
        LandRS rs = landService.updateLand(farmerId, landId, rq);
        return ResponseEntity.ok(rs);
    }

    @DeleteMapping("/{landId}")
    public ResponseEntity<Void> deleteLand(
            @PathVariable Long farmerId,
            @PathVariable Long landId
    ) {
        landService.deleteLand(farmerId, landId);
        return ResponseEntity.noContent().build();
    }
}