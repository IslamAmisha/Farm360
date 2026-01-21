package com.Farm360.controller.agreement;

import com.Farm360.dto.request.agreement.AgreementCreateRequestDTO;
import com.Farm360.dto.response.agreement.AgreementResponseDTO;
import com.Farm360.dto.response.agreement.AgreementSummaryDTO;
import com.Farm360.service.agreement.AgreementService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agreements")
public class AgreementController {

//    private final AgreementService agreementService;
//
//    public AgreementController(AgreementService agreementService) {
//        this.agreementService = agreementService;
//    }
//
//    // ==================================================
//    // Create Agreement
//    // ==================================================
//    @PostMapping
//    public ResponseEntity<AgreementResponseDTO> createAgreement(
//            @RequestBody AgreementCreateRequestDTO request
//    ) {
//        AgreementResponseDTO response =
//                agreementService.createAgreementFromProposal(
//                        request.getProposalId()
//                );
//
//        return new ResponseEntity<>(response, HttpStatus.CREATED);
//    }
//
//    // ==================================================
//    // Get by Proposal ID
//    // ==================================================
//    @GetMapping("/by-proposal/{proposalId}")
//    public ResponseEntity<AgreementResponseDTO> getByProposalId(
//            @PathVariable Long proposalId
//    ) {
//        return ResponseEntity.ok(
//                agreementService.getByProposalId(proposalId)
//        );
//    }
//
//    // ==================================================
//    // Buyer Agreements
//    // ==================================================
//    @GetMapping("/buyer/{buyerId}")
//    public ResponseEntity<List<AgreementSummaryDTO>> getByBuyer(
//            @PathVariable Long buyerId
//    ) {
//        return ResponseEntity.ok(
//                agreementService.getByBuyerId(buyerId)
//        );
//    }
//
//    // ==================================================
//    // Farmer Agreements
//    // ==================================================
//    @GetMapping("/farmer/{farmerId}")
//    public ResponseEntity<List<AgreementSummaryDTO>> getByFarmer(
//            @PathVariable Long farmerId
//    ) {
//        return ResponseEntity.ok(
//                agreementService.getByFarmerId(farmerId)
//        );
//    }
//
//    // ==================================================
//    // Terminate Agreement
//    // ==================================================
//    @PostMapping("/{agreementId}/terminate")
//    public ResponseEntity<AgreementResponseDTO> terminate(
//            @PathVariable Long agreementId
//    ) {
//        return ResponseEntity.ok(
//                agreementService.terminateAgreement(agreementId)
//        );
//    }
}
