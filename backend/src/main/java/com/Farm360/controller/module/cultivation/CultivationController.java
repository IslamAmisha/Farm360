package com.Farm360.controller.module.cultivation;

import com.Farm360.dto.request.module.cultivation.CultivationConcernCreateRQ;
import com.Farm360.dto.request.module.cultivation.CultivationFeedbackCreateRQ;
import com.Farm360.dto.request.module.cultivation.CultivationExecutionCreateRQ;
import com.Farm360.dto.request.module.cultivation.CultivationUpdateCreateRQ;
import com.Farm360.dto.response.module.cultivation.CultivationConcernRS;
import com.Farm360.dto.response.module.cultivation.CultivationExecutionRS;
import com.Farm360.dto.response.module.cultivation.CultivationFeedbackRS;
import com.Farm360.dto.response.module.cultivation.CultivationUpdateRS;
import com.Farm360.service.module.cultivation.CultivationExecutionService;
import com.Farm360.service.module.cultivation.CultivationInteractionService;
import com.Farm360.utils.CultivationStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for all cultivation operations:
 * - Execution lifecycle
 * - Farmer updates
 * - Buyer feedback & concerns
 *
 * Timeline projection is on hold.
 */
@RestController
@RequestMapping("/api/cultivation")
@RequiredArgsConstructor
public class CultivationController {

    private final CultivationExecutionService cultivationExecutionService;
    private final CultivationInteractionService cultivationInteractionService;

    /* ------------------ EXECUTION ------------------ */

    @PostMapping("/execution")
    public ResponseEntity<CultivationExecutionRS> createExecution(
            @RequestBody CultivationExecutionCreateRQ rq
    ) {
        return ResponseEntity.ok(
                cultivationExecutionService.createExecution(rq)
        );
    }

    @PutMapping("/execution/{executionId}/status")
    public ResponseEntity<CultivationExecutionRS> updateExecutionStatus(
            @PathVariable Long executionId,
            @RequestParam("status") CultivationStatus status
    ) {
        return ResponseEntity.ok(
                cultivationExecutionService.updateExecutionStatus(executionId, status)
        );
    }

    @GetMapping("/execution/{executionId}")
    public ResponseEntity<CultivationExecutionRS> getExecution(
            @PathVariable Long executionId
    ) {
        return ResponseEntity.ok(
                cultivationExecutionService.getExecutionById(executionId)
        );
    }

    @GetMapping("/execution/agreement/{agreementId}")
    public ResponseEntity<List<CultivationExecutionRS>> getExecutionsByAgreement(
            @PathVariable Long agreementId
    ) {
        return ResponseEntity.ok(
                cultivationExecutionService.getExecutionsByAgreement(agreementId)
        );
    }

    @GetMapping("/execution/farmer/{farmerId}")
    public ResponseEntity<List<CultivationExecutionRS>> getExecutionsByFarmer(
            @PathVariable Long farmerId
    ) {
        return ResponseEntity.ok(
                cultivationExecutionService.getExecutionsByFarmer(farmerId)
        );
    }

    /* ------------------ FARMER UPDATES ------------------ */

    @PostMapping("/update")
    public ResponseEntity<CultivationUpdateRS> addUpdate(
            @RequestBody CultivationUpdateCreateRQ rq
    ) {
        return ResponseEntity.ok(
                cultivationInteractionService.addUpdate(rq)
        );
    }

    @GetMapping("/update/{executionId}")
    public ResponseEntity<List<CultivationUpdateRS>> getUpdatesByExecution(
            @PathVariable Long executionId
    ) {
        return ResponseEntity.ok(
                cultivationInteractionService.getUpdatesByExecution(executionId)
        );
    }

    /* ------------------ BUYER FEEDBACK ------------------ */

    @PostMapping("/feedback")
    public ResponseEntity<CultivationFeedbackRS> addFeedback(
            @RequestBody CultivationFeedbackCreateRQ rq
    ) {
        return ResponseEntity.ok(
                cultivationInteractionService.addFeedback(rq)
        );
    }

    @GetMapping("/feedback/{executionId}")
    public ResponseEntity<List<CultivationFeedbackRS>> getFeedbackByExecution(
            @PathVariable Long executionId
    ) {
        return ResponseEntity.ok(
                cultivationInteractionService.getFeedbackByExecution(executionId)
        );
    }

    /* ------------------ BUYER CONCERNS ------------------ */

    @PostMapping("/concern")
    public ResponseEntity<CultivationConcernRS> raiseConcern(
            @RequestBody CultivationConcernCreateRQ rq
    ) {
        return ResponseEntity.ok(
                cultivationInteractionService.raiseConcern(rq)
        );
    }

    @GetMapping("/concern/{executionId}")
    public ResponseEntity<List<CultivationConcernRS>> getConcernsByExecution(
            @PathVariable Long executionId
    ) {
        return ResponseEntity.ok(
                cultivationInteractionService.getConcernsByExecution(executionId)
        );
    }
}
