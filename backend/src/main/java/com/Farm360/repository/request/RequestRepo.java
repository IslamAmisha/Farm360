package com.Farm360.repository.request;

import com.Farm360.model.request.RequestEntity;
import com.Farm360.utils.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestRepo extends JpaRepository<RequestEntity, Long> {

    List<RequestEntity> findByReceiver_Id(Long receiverId);

    // outgoing requests for user
    List<RequestEntity> findBySender_Id(Long senderId);

    // check duplicate
    boolean existsBySender_IdAndReceiver_Id(Long senderId, Long receiverId);

    // pending count for sidebar badge
    int countByReceiver_IdAndStatus(Long receiverId, RequestStatus status);
}