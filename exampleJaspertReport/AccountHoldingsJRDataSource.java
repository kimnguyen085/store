package com.gbst.frontoffice.server.jasperreports.datasource.holdings;

import java.text.SimpleDateFormat;
import java.util.Date;

import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JRField;

import com.gbst.frontoffice.shared.dto.AccountHoldingsDTO;

/**
 * @author Tim Cole <tim@livewirelabs.com.au>
 */
public class AccountHoldingsJRDataSource extends AbstractHoldingsJRDatasource {

    private final AccountHoldingsDTO accountHoldings;
    private final String adviserCode;
    private final String adviserName;
    private final String fullName;

    public AccountHoldingsJRDataSource(AccountHoldingsDTO accountHoldings,
                                       Date asAtDate,
                                       boolean showCostAndPL,
                                       String clientName,
                                       String address,
                                       String adviserCode,
                                       String adviserName,
                                       String fullName) {
        super(asAtDate, clientName, showCostAndPL, accountHoldings, address);
        this.accountHoldings = accountHoldings;
        this.adviserCode = adviserCode;
        this.adviserName = adviserName;
        this.fullName =fullName;
    }

    @Override
    protected boolean isEmpty() {
        return accountHoldings == null;
    }

    @Override
    public Object getFieldValue(JRField jrField) throws JRException {
        String jrFieldName = jrField.getName();
        if ("accountName".equals(jrFieldName)) {
            return accountHoldings.getAccountName();
        } else if ("accountNumber".equals(jrFieldName)) {
            return accountHoldings.getAccountId().getAccountNumber();
        } else if ("isNotEmpty".equals(jrFieldName)) {
            return hasData();
        } else if ("cashAccountsDataSource".equals(jrFieldName)) {
            return accountHoldings.getCashAccounts() == null || accountHoldings.getCashAccounts().isEmpty() ? null : new CashAccountsJRDataSource(accountHoldings.getCashAccounts(), totalPortfolioValuation);
        } else if ("equityHoldingsDataSource".equals(jrFieldName)) {
            return accountHoldings.getEquityHoldingPositions() == null || accountHoldings.getEquityHoldingPositions().isEmpty() ? null : new EquityHoldingsJRDataSource(accountHoldings.getEquityHoldingPositions(), asAtDate, showCostAndPL, totalPortfolioValuation);
        } else if ("managedFundHoldingsDataSource".equals(jrFieldName)) {
            return accountHoldings.getManagedFundHoldingPositions() == null || accountHoldings.getManagedFundHoldingPositions().isEmpty() ? null : new EquityHoldingsJRDataSource(accountHoldings.getManagedFundHoldingPositions(), asAtDate, showCostAndPL, totalPortfolioValuation);
        } else if ("fixedInterestHoldingsDataSource".equals(jrFieldName)) {
            return accountHoldings.getFixedInterestHoldingPositions() == null || accountHoldings.getFixedInterestHoldingPositions().isEmpty() ? null : new EquityHoldingsJRDataSource(accountHoldings.getFixedInterestHoldingPositions(), asAtDate, showCostAndPL, totalPortfolioValuation);
        } else if ("termDepositAccountsDataSource".equals(jrFieldName)) {
            return accountHoldings.getTermDeposits() == null || accountHoldings.getTermDeposits().isEmpty() ? null : new TermDepositsJRDataSource(accountHoldings.getTermDeposits());
        } else if ("bankBillsDataSource".equals(jrFieldName)) {
            return accountHoldings.getBankBills() == null || accountHoldings.getBankBills().isEmpty() ? null : new BankBillsJRDataSource(accountHoldings.getBankBills(), totalPortfolioValuation);
        } else if ("facilityPositionsDataSource".equals(jrFieldName)) {
            return accountHoldings.getMarginLendingPositions() == null || accountHoldings.getMarginLendingPositions().isEmpty() ? null : new FacilityPositionsJRDataSource(accountHoldings.getMarginLendingPositions());
        } else if ("facilitiesAndHoldingsDataSource".equals(jrFieldName)) {
            return accountHoldings.getMarginLendingHoldings() == null || accountHoldings.getMarginLendingHoldings().isEmpty() ? null : new FacilityAndHoldingsJRDataSource(accountHoldings.getMarginLendingHoldings());
        } else if ("optionHoldingsDataSource".equals(jrFieldName)) {
            return accountHoldings.getOptionHoldingPositions() == null || accountHoldings.getOptionHoldingPositions().isEmpty() ? null : new OptionHoldingsJRDataSource(accountHoldings.getOptionHoldingPositions(), showCostAndPL);
        } else if ("collateralHoldingsDataSource".equals(jrFieldName)) {
            return accountHoldings.getCollateralHoldings() == null || accountHoldings.getCollateralHoldings().isEmpty() ? null : new CollateralHoldingsJRDataSource(accountHoldings.getCollateralHoldings());
        } else if ("clientName".equals(jrFieldName)) {
            return clientName;
        } else if ("address".equals(jrFieldName)) {
            return address;
        } else if ("adviserCode".equals(jrFieldName)) {
            return adviserCode;
        } else if ("adviserName".equals(jrFieldName)) {
            return adviserName;
        } else if ("asAtDate".equals(jrFieldName)) {
        	if(asAtDate == null) {
        		return new Date();
        	}
        	return asAtDate;
        } else if ("adviser".equals(jrFieldName)) {
            return adviserName;
        } else if ("fullName".equals(jrFieldName)) {
            return fullName;
        } else if ("accountNo".equals(jrFieldName)) {
            return accountHoldings.getAccountId().getAccountNumber();
        } else if ("asAtDateString".equals(jrFieldName)) {
            if (asAtDate == null) {
                return new SimpleDateFormat("dd MMMM yyyy").format(new Date());
            }
            return new SimpleDateFormat("dd MMMM yyyy").format(asAtDate);
        } else if ("datePrinted".equals(jrFieldName)) {
            return new SimpleDateFormat("dd MMMM yyyy").format(new Date());
        } else if ("adviserPhone".equals(jrFieldName)) {
            return "123-456789";
        }
        throw new IllegalArgumentException("Unsupported field name " + jrFieldName);
    }

    private boolean hasData() {
        return accountHoldings != null &&
                (!accountHoldings.getEquityHoldingPositions().isEmpty() ||
                        !accountHoldings.getManagedFundHoldingPositions().isEmpty() ||
                        !accountHoldings.getFixedInterestHoldingPositions().isEmpty() ||
                        !accountHoldings.getTermDeposits().isEmpty() ||
                        !accountHoldings.getBankBills().isEmpty() ||
                        !accountHoldings.getOptionHoldingPositions().isEmpty() ||
                        !accountHoldings.getCollateralHoldings().isEmpty() ||
                        !accountHoldings.getMarginLendingPositions().isEmpty() ||
                        !accountHoldings.getMarginLendingHoldings().isEmpty());
    }
}