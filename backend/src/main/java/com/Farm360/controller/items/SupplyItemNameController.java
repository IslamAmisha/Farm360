package com.Farm360.controller.items;

import com.Farm360.model.master.items.SupplyItemName;
import com.Farm360.repository.master.items.SupplyItemNameRepository;
import com.Farm360.utils.SupplierType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/item-names")
public class SupplyItemNameController {

    @Autowired
    private SupplyItemNameRepository itemNameRepo;

    @GetMapping
    public List<String> getItemNames(
            @RequestParam SupplierType supplierType
    ) {

        List<String> defaultItems = getDefaultItems(supplierType);

        List<String> dynamicItems = itemNameRepo
                .findBySupplierTypeAndActiveTrue(supplierType)
                .stream()
                .map(SupplyItemName::getName)
                .toList();

        Set<String> merged = new LinkedHashSet<>();
        merged.addAll(defaultItems);
        merged.addAll(dynamicItems);

        return new ArrayList<>(merged);
    }

    private List<String> getDefaultItems(SupplierType supplierType) {

        return switch (supplierType) {

            case MACHINERY_RENTAL -> List.of(
                    "Tractor",
                    "Rotavator",
                    "Seeder Machine",
                    "Harvesting Machine"
            );

            case SERVICE_PROVIDER -> List.of(
                    "Spraying Service",
                    "Land Leveling",
                    "General Labour",
                    "Weeding Service"
            );

            case INPUT_SUPPLIER -> List.of(
                    "Seed",
                    "Fertilizer",
                    "Urea",
                    "Pesticide"
            );

            case LOGISTICS_PROVIDER -> List.of(
                    "Transport to Warehouse",
                    "Cold Storage Delivery"
            );
        };
    }
}