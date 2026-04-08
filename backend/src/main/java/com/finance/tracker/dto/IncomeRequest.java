package com.finance.tracker.dto;

import com.finance.tracker.enums.IncomeFrequency;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDate;

@Data
public class IncomeRequest {

    @NotBlank(message = "Income source is required")
    private String source;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private Double amount;

    @NotNull(message = "Frequency is required")
    private IncomeFrequency frequency;

    @NotNull(message = "isRecurring flag is required")
    private Boolean isRecurring;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    private String description;
}
