package com.finance.tracker.dto;

import com.finance.tracker.enums.Category;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BudgetResponse {

    private Category category;
    private Double budgetAmount;
    private Double actualSpend;
    private Double remaining;
    private Double percentUsed;
}
