package com.Farm360.controller.request;

import com.Farm360.dto.request.sendreq.SendRequestRQ;
import com.Farm360.dto.request.sendreq.UpdateRequestRQ;
import com.Farm360.service.request.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/request")
public class RequestController {

    @Autowired
    private RequestService requestService;

    // API: Send request
    @PostMapping("/send")
    public ResponseEntity<?> send(
            @RequestParam Long userId,   // logged-in user
            @RequestBody SendRequestRQ rq) {
        return ResponseEntity.ok(requestService.sendRequest(userId, rq));
    }

    // API: Accept / Reject request
    @PostMapping("/update")
    public ResponseEntity<?> update(@RequestBody UpdateRequestRQ rq) {
        return ResponseEntity.ok(requestService.updateRequest(rq));
    }

    // API: Get incoming requests
    @GetMapping("/incoming")
    public ResponseEntity<?> incoming(@RequestParam Long userId) {
        return ResponseEntity.ok(requestService.getIncomingRequests(userId));
    }

    // API: Get outgoing requests
    @GetMapping("/outgoing")
    public ResponseEntity<?> outgoing(@RequestParam Long userId) {
        return ResponseEntity.ok(requestService.getOutgoingRequests(userId));
    }
}


