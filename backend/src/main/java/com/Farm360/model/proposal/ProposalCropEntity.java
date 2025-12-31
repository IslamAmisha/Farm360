package com.Farm360.model.proposal;

import com.Farm360.utils.SeasonType;
import com.Farm360.utils.UnitType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "proposal_crops")
@Builder
public class ProposalCropEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long proposalCropId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "proposal_id", nullable = false)
    private ProposalEntity proposal;

    @Column(nullable = false)
    private Long cropId;

    private Long cropSubCategoryId;

    @Enumerated(EnumType.STRING)
    private SeasonType season; // KHARIF / RABI / ZAID

    private Double expectedQuantity;

    @Enumerated(EnumType.STRING)
    private UnitType unit;

    // optional – if crop uses partial area
    private Double landAreaUsed;
}
