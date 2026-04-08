package com.finance.tracker.dto;

import com.finance.tracker.enums.Category;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ExpenseRequest {

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private Double amount;

    @NotNull(message = "Category is required")
    private Category category;

    private String description;

    @NotNull(message = "Date is required")
    private LocalDate date;
}
