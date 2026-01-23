package com.Farm360.model.proposal;

import com.Farm360.utils.Role;
import com.Farm360.utils.ProposalActionType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "proposal_action_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProposalActionHistoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long proposalId;

    @Column(nullable = false)
    private Integer proposalVersion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role actionBy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProposalActionType actionType;

    private LocalDateTime actionAt;

    @Column(length = 1000)
    private String remarks;
}
