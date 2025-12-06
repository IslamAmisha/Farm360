package com.Farm360.service.land;

import com.Farm360.dto.request.land.LandRQ;
import com.Farm360.dto.request.land.LandUpdateRQ;
import com.Farm360.dto.response.land.LandRS;

import java.util.List;

public interface LandService {

    LandRS createLand(Long farmerId, LandRQ rq);

    List<LandRS> getLandsByFarmer(Long farmerId);

    LandRS updateLand(Long farmerId, Long landId, LandUpdateRQ rq);

    void deleteLand(Long farmerId, Long landId);
}
