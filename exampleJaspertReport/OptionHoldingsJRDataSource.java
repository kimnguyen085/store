package com.gbst.frontoffice.server.jasperreports.datasource.holdings;

import com.gbst.frontoffice.shared.dto.OptionHoldingDTO;
import com.gbst.reporting.datasources.IterableJRDataSource;

import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JRField;

import java.io.Serializable;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Date;

import static com.gbst.frontoffice.common.math.BigDecimalUtils.addNullSafe;

/**
 * @author Tim Cole <tim@livewirelabs.com.au>
 */
public class OptionHoldingsJRDataSource extends IterableJRDataSource<OptionHoldingDTO> implements Serializable {

    private final BigDecimal groupTotalCost;
    private final BigDecimal groupMarketValue;
    private final BigDecimal groupUnrealisedProfitLoss;
    private final boolean showCostAndPL;

    public OptionHoldingsJRDataSource(Iterable<? extends OptionHoldingDTO> holdings, boolean showCostAndPL) {
        super(holdings);
        this.showCostAndPL = showCostAndPL;

        BigDecimal groupTotalCost = BigDecimal.ZERO;
        BigDecimal groupMarketValue = BigDecimal.ZERO;
        BigDecimal groupUnrealisedProfitLoss = BigDecimal.ZERO;
        if (holdings != null) {
            for (OptionHoldingDTO holding : holdings) {
                groupTotalCost = addNullSafe(groupTotalCost, holding.getTotalCost());
                groupMarketValue = addNullSafe(groupMarketValue, holding.getMarketValue());
                groupUnrealisedProfitLoss = addNullSafe(groupUnrealisedProfitLoss, holding.getProfitLoss());
            }
        }
        this.groupMarketValue = groupMarketValue;
        this.groupTotalCost = groupTotalCost;
        this.groupUnrealisedProfitLoss = groupUnrealisedProfitLoss;
    }

    @Override
    public Object getFieldValue(JRField jrField) throws JRException {
        String jrFieldName = jrField.getName();
        if ("assetClass".equals(jrFieldName)) {
            return getCurrentElement().getSector();
        } else if ("security".equals(jrFieldName)) {
            return getCurrentElement().getSecurityCode();
        } else if ("type".equals(jrFieldName)) {
            return safeName(getCurrentElement().getOptionType());
        } else if ("underlying".equals(jrFieldName)) {
            return getCurrentElement().getUnderlyingProduct();
        } else if ("month".equals(jrFieldName)) {
            return getCurrentElement().getDelMonthText();
        } else if ("strike".equals(jrFieldName)) {
            return getCurrentElement().getStrikePrice();
        } else if ("expiry".equals(jrFieldName)) {
            return getCurrentElement().getExpiryDate();
        } else if ("buySell".equals(jrFieldName)) {
            return safeName(getCurrentElement().getBuySell());
        } else if ("tradedPrice".equals(jrFieldName)) {
            return getCurrentElement().getTradedPrice();
        } else if ("tradedValue".equals(jrFieldName)) {
            return getCurrentElement().getTradedValue();
        } else if ("marketValue".equals(jrFieldName)) {
            return getCurrentElement().getMarketValue();
        } else if ("units".equals(jrFieldName)) {
            return getCurrentElement().getQuantity();
        } else if ("unrealisedProfitAndLoss".equals(jrFieldName)) {
            return getCurrentElement().getProfitLoss();
        } else if ("groupTotalCost".equals(jrFieldName)) {
            return groupTotalCost;
        } else if ("groupMarketValue".equals(jrFieldName)) {
            return groupMarketValue;
        } else if ("groupUnrealisedProfitLoss".equals(jrFieldName)) {
            return groupUnrealisedProfitLoss;
        } else if ("showCostAndPL".equals(jrFieldName)) {
            return showCostAndPL;
        } else if ("tradeDate".equals(jrFieldName)) {
            return getCurrentElement().getTradeDate();
        } else if ("reference".equals(jrFieldName)) {
            return getCurrentElement().getReference();
        }
        throw new IllegalArgumentException("Unsupported field name " + jrField.getName());
    }
}