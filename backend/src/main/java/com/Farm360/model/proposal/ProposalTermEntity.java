package com.Farm360.model.proposal;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Proposal_Terms")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProposalTermEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long termId;

    @ManyToOne
    @JoinColumn(name = "proposal_id", nullable = false)
    private ProposalEntity proposal;

    @Column(nullable = false)
    private String termKey;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String termValue;

    @Column(nullable = false)
    private Boolean isMandatory;

    @Column(nullable = false)
    private Boolean editable;
}
