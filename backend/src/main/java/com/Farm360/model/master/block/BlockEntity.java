package com.Farm360.model.master.block;

import com.Farm360.model.master.city.CityEntity;
import com.Farm360.model.master.district.DistrictEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "block")
public class BlockEntity {
    @Id
    private Long id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "district_id")
    private DistrictEntity district;

    @OneToMany(mappedBy = "block")
    private List<CityEntity> cities;

}
