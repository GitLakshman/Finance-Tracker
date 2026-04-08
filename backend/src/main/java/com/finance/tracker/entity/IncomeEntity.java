package com.finance.tracker.entity;

import com.finance.tracker.enums.IncomeFrequency;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;
import java.time.LocalDate;

@Entity
@Table(name = "incomes")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class IncomeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private String source;

    @Column(nullable = false)
    private Double amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IncomeFrequency frequency;

    @Column(nullable = false)
    private Boolean isRecurring;

    @Column(nullable = false)
    private LocalDate startDate;

    private String description;

    @CreationTimestamp
    @Column(updatable = false)
    private Timestamp createdAt;
}
