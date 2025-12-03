package com.Farm360.model.audit;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.Date;

@Data
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public class AuditTable<U> {

    @CreatedBy
    @Column(name= "created_by", updatable=false)
    private U createdBy;

    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss", timezone="Asia/Kolkata")
    @CreationTimestamp
    @Basic
    @Column(name= "created_date", updatable=false)
    private Date createdDate;

    @LastModifiedBy
    @Column(name= "modified_by")
    private U modifiedBy;

    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss", timezone="Asia/Kolkata")
    @UpdateTimestamp
    @Basic
    @Column(name="modified_date")
    private Date modifiedDate;
}
