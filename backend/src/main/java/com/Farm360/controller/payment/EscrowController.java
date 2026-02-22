package com.Farm360.controller.payment;

import com.Farm360.dto.response.payment.EscrowTransactionRS;
import com.Farm360.dto.response.payment.WalletBalanceRS;
import com.Farm360.model.payment.BuyerWallet;
import com.Farm360.model.payment.EscrowTransaction;
import com.Farm360.model.payment.FarmerWallet;
import com.Farm360.repository.payment.BuyerWalletRepository;
import com.Farm360.repository.payment.EscrowTransactionRepository;
import com.Farm360.repository.payment.FarmerWalletRepository;
import com.Farm360.security.UserDetailsImpl;
import com.Farm360.service.escrow.EscrowService;
import com.Farm360.utils.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/escrow")
public class EscrowController {

    @Autowired
    private BuyerWalletRepository buyerWalletRepo;

    @Autowired
    private FarmerWalletRepository farmerWalletRepo;

    @Autowired
    private EscrowTransactionRepository escrowTxnRepo;

    @Autowired
    private EscrowService escrowService;

    @GetMapping("/wallet")
    public WalletBalanceRS getWalletBalance(Authentication authentication) {

        UserDetailsImpl user =
                (UserDetailsImpl) authentication.getPrincipal();

        if (user.getRole() == Role.buyer) {

            BuyerWallet wallet = buyerWalletRepo
                    .findByBuyerUserId(user.getId())
                    .orElseThrow();

            return WalletBalanceRS.builder()
                    .balance(wallet.getBalance())
                    .supplierLocked(wallet.getSupplierLocked())
                    .farmerProfitLocked(wallet.getFarmerProfitLocked())
                    .build();
        }

        if (user.getRole() == Role.farmer) {

            FarmerWallet wallet = farmerWalletRepo
                    .findByFarmerUserId(user.getId())
                    .orElseThrow();

            return WalletBalanceRS.builder()
                    .balance(wallet.getAvailableBalance())
                    .build();
        }

        throw new RuntimeException("Unsupported role");
    }

    @GetMapping("/transactions")
    public List<EscrowTransactionRS> getMyEscrowTransactions(
            Authentication authentication
    ) {

        UserDetailsImpl user =
                (UserDetailsImpl) authentication.getPrincipal();

        List<EscrowTransaction> txns;

        if (user.getRole() == Role.buyer) {
            txns = escrowTxnRepo
                    .findByBuyerUserIdOrderByTimestampDesc(user.getId());
        } else if (user.getRole() == Role.farmer) {
            txns = escrowTxnRepo
                    .findByFarmerUserIdOrderByTimestampDesc(user.getId());
        } else {
            throw new RuntimeException("Unsupported role");
        }

        return txns.stream()
                .map(tx -> EscrowTransactionRS.builder()
                        .amount(tx.getAmount())
                        .purpose(tx.getPurpose().name())
                        .action(tx.getAction())
                        .reference(tx.getReference())
                        .timestamp(tx.getTimestamp())
                        .build()
                )
                .toList();
    }

    @PostMapping("/deposit")
    public void deposit(
            @RequestParam Double amount,
            Authentication authentication
    ) {

        UserDetailsImpl user =
                (UserDetailsImpl) authentication.getPrincipal();

        if (user.getRole() != Role.buyer)
            throw new RuntimeException("Only buyer can deposit");

        escrowService.depositToBuyerWallet(user.getId(), amount);
    }
}
