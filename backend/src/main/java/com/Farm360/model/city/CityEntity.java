package com.Farm360.model.city;

import com.Farm360.model.block.BlockEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name="city_table")
public class CityEntity {
    @Id
    @GeneratedValue
    private Long id;
    private String name;

    @ManyToOne
    private BlockEntity block;
}