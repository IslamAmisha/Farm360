package com.Farm360.controller;

import com.Farm360.utils.AnnualPurchase;
import com.Farm360.utils.BusinessAge;
import com.Farm360.utils.BusinessScale;
import com.Farm360.utils.BusinessType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/master/enums")
public class EnumController {

    @GetMapping("/businessType")
    public BusinessType[] getBusinessTypes() {
        return BusinessType.values();
    }

    @GetMapping("/businessScale")
    public BusinessScale[] getBusinessScales() {
        return BusinessScale.values();
    }


    @GetMapping("/businessAge")
    public BusinessAge[] getBusinessAges() {
        return BusinessAge.values();
    }


    @GetMapping("/annualPurchase")
    public AnnualPurchase[] getAnnualPurchases() {
        return AnnualPurchase.values();
    }
}
