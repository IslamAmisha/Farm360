package com.Farm360.controller.module.input;

import com.Farm360.dto.request.module.input.InputSupplyApprovalRQ;
import com.Farm360.dto.request.module.input.InputSupplyOrderCreateRQ;
import com.Farm360.dto.request.module.input.InputSupplyProofUploadRQ;
import com.Farm360.dto.response.module.input.InputSupplyApprovalRS;
import com.Farm360.dto.response.module.input.InputSupplyOrderRS;
import com.Farm360.dto.response.module.input.InputSupplyProofRS;
import com.Farm360.security.UserDetailsImpl;
import com.Farm360.service.module.input.InputSupplyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/input-supply")
@RequiredArgsConstructor
public class InputSupplyController {

    private final InputSupplyService inputSupplyService;

    @PostMapping("/agreements/{agreementId}/orders")
    public ResponseEntity<InputSupplyOrderRS> createOrder(
            @PathVariable Long agreementId,
            @RequestBody InputSupplyOrderCreateRQ rq,
            Authentication authentication
    ) {
        Long buyerUserId =
                ((UserDetailsImpl) authentication.getPrincipal()).getId();

        return ResponseEntity.ok(
                inputSupplyService.createOrder(agreementId, rq, buyerUserId)
        );
    }

    @PostMapping("/orders/{orderId}/proof")
    public ResponseEntity<InputSupplyProofRS> uploadProof(
            @PathVariable Long orderId,
            @RequestBody InputSupplyProofUploadRQ rq,
            Authentication authentication
    ) {
        Long farmerUserId =
                ((UserDetailsImpl) authentication.getPrincipal()).getId();

        return ResponseEntity.ok(
                inputSupplyService.uploadProof(orderId, rq, farmerUserId)
        );
    }

    @PostMapping("/orders/{orderId}/decision")
    public ResponseEntity<InputSupplyApprovalRS> approveOrReject(
            @PathVariable Long orderId,
            @RequestBody InputSupplyApprovalRQ rq,
            Authentication authentication
    ) {
        Long buyerUserId =
                ((UserDetailsImpl) authentication.getPrincipal()).getId();

        return ResponseEntity.ok(
                inputSupplyService.approveOrReject(orderId, rq, buyerUserId)
        );
    }


    @GetMapping("/orders/{orderId}")
    public ResponseEntity<InputSupplyOrderRS> getOrder(
            @PathVariable Long orderId,
            Authentication authentication
    ) {
        Long userId =
                ((UserDetailsImpl) authentication.getPrincipal()).getId();

        return ResponseEntity.ok(
                inputSupplyService.getOrder(orderId, userId)
        );
    }

    @GetMapping("/agreements/{agreementId}/orders")
    public ResponseEntity<List<InputSupplyOrderRS>> getOrdersByAgreement(
            @PathVariable Long agreementId
    ) {
        return ResponseEntity.ok(
                inputSupplyService.getOrdersByAgreement(agreementId)
        );
    }
}
