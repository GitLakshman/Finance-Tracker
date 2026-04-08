package com.finance.tracker.repository;

import com.finance.tracker.entity.IncomeEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface IncomeRepository extends JpaRepository<IncomeEntity, Long> {
    Page<IncomeEntity> findAllByUserIdOrderByStartDateDesc(String userId, Pageable pageable);

    List<IncomeEntity> findByUserIdOrderByStartDateDesc(String userId);

    @Query("SELECT COALESCE(SUM(i.amount), 0) FROM IncomeEntity i WHERE i.userId = :userId AND i.startDate BETWEEN :dateFrom AND :dateTo")
    Double sumAmountByUserIdAndDateBetween(@Param("userId") String userId,
                                           @Param("dateFrom") LocalDate dateFrom,
                                           @Param("dateTo") LocalDate dateTo);
}
