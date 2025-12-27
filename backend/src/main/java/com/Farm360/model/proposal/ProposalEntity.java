package com.Farm360.model.proposal;

import com.Farm360.model.BuyerEntity;
import com.Farm360.model.FarmerEntity;
import com.Farm360.model.request.RequestEntity;
import com.Farm360.utils.ProposalStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "Proposal_Table")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProposalEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long proposalId;

    @OneToOne
    @JoinColumn(name = "request_id", nullable = false)
    private RequestEntity request;

    @ManyToOne
    @JoinColumn(name = "buyer_id", nullable = false)
    private BuyerEntity buyer;

    @ManyToOne
    @JoinColumn(name = "farmer_id", nullable = false)
    private FarmerEntity farmer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProposalStatus status;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime lastUpdatedAt;

    @OneToMany(mappedBy = "proposal", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProposalTermEntity> terms;
}
