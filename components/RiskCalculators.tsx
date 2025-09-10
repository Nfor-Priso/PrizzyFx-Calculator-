
import React, { useState, useMemo } from 'react';
import { CURRENCY_PAIRS, ICONS } from '../constants';

interface CalculatorCardProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

const CalculatorCard: React.FC<CalculatorCardProps> = ({ title, icon, children }) => (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-6 hover:border-cyan-400/50 transition-all duration-300">
        <div className="flex items-center mb-4">
            {icon}
            <h3 className="ml-3 text-xl font-semibold text-white">{title}</h3>
        </div>
        <div>{children}</div>
    </div>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const Input: React.FC<InputProps> = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <input
            id={id}
            {...props}
            className="w-full bg-gray-900/50 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
        />
    </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ label, id, children, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <select
            id={id}
            {...props}
            className="w-full bg-gray-900/50 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
        >
            {children}
        </select>
    </div>
);

const ResultDisplay: React.FC<{ label: string; value: string | number; color?: string }> = ({ label, value, color = 'text-cyan-400' }) => (
    <div className="mt-4 bg-gray-900/70 p-3 rounded-lg">
        <p className="text-sm text-gray-400">{label}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
);

// Individual Calculator Components defined in the same file
const LotSizeCalculator: React.FC = () => {
    const [accountBalance, setAccountBalance] = useState('10000');
    const [riskPercentage, setRiskPercentage] = useState('1');
    const [stopLossPips, setStopLossPips] = useState('20');
    const [pair, setPair] = useState('EUR/USD');

    const lotSize = useMemo(() => {
        const balance = parseFloat(accountBalance);
        const risk = parseFloat(riskPercentage);
        const sl = parseFloat(stopLossPips);

        if (isNaN(balance) || isNaN(risk) || isNaN(sl) || balance <= 0 || risk <= 0 || sl <= 0) {
            return { lotSize: '0.00', riskAmount: '$0.00', positionSize: '0' };
        }

        const riskAmount = balance * (risk / 100);
        const pipValuePerLot = 10; // Assuming standard lot for USD based pairs
        const totalRiskInQuote = sl * pipValuePerLot;
        const calculatedLotSize = riskAmount / totalRiskInQuote;

        return {
            lotSize: calculatedLotSize.toFixed(2),
            riskAmount: `$${riskAmount.toFixed(2)}`,
            positionSize: (calculatedLotSize * 100000).toLocaleString('en-US') + ' units'
        };
    }, [accountBalance, riskPercentage, stopLossPips, pair]);

    return (
        <CalculatorCard title="Position Size Calculator" icon={ICONS.lotSize}>
            <div className="space-y-4">
                <Input label="Account Balance ($)" type="number" value={accountBalance} onChange={e => setAccountBalance(e.target.value)} placeholder="e.g., 10000" />
                <Input label="Risk per Trade (%)" type="number" value={riskPercentage} onChange={e => setRiskPercentage(e.target.value)} placeholder="e.g., 1" />
                <Input label="Stop Loss (pips)" type="number" value={stopLossPips} onChange={e => setStopLossPips(e.target.value)} placeholder="e.g., 20" />
                <Select label="Currency Pair" value={pair} onChange={e => setPair(e.target.value)}>
                    {CURRENCY_PAIRS.map(p => <option key={p} value={p}>{p}</option>)}
                </Select>
                <ResultDisplay label="Recommended Lot Size" value={lotSize.lotSize} />
                <ResultDisplay label="Amount at Risk" value={lotSize.riskAmount} color="text-amber-400" />
                <ResultDisplay label="Position Size" value={lotSize.positionSize} color="text-gray-300" />
            </div>
        </CalculatorCard>
    );
};

const PipValueCalculator: React.FC = () => {
    const [pair, setPair] = useState('EUR/USD');
    const [lotSize, setLotSize] = useState('1.0');

    const pipValue = useMemo(() => {
        const size = parseFloat(lotSize);
        if (isNaN(size) || size <= 0) return '$0.00';
        // Simplified calculation assuming USD as quote currency
        const standardPipValue = 10;
        return `$${(standardPipValue * size).toFixed(2)}`;
    }, [pair, lotSize]);

    return (
        <CalculatorCard title="Pip Value Calculator" icon={ICONS.pipValue}>
            <div className="space-y-4">
                <Select label="Currency Pair" value={pair} onChange={e => setPair(e.target.value)}>
                    {CURRENCY_PAIRS.map(p => <option key={p} value={p}>{p}</option>)}
                </Select>
                <Input label="Lot Size" type="number" value={lotSize} onChange={e => setLotSize(e.target.value)} placeholder="e.g., 1.0" />
                <ResultDisplay label="Value per Pip" value={pipValue} />
            </div>
        </CalculatorCard>
    );
};

const ProfitLossCalculator: React.FC = () => {
    const [pips, setPips] = useState('50');
    const [lotSize, setLotSize] = useState('0.10');

    const profitLoss = useMemo(() => {
        const p = parseFloat(pips);
        const l = parseFloat(lotSize);
        if (isNaN(p) || isNaN(l)) return { value: '$0.00', color: 'text-gray-300' };

        const pipValue = 10; // per standard lot
        const result = p * l * pipValue;

        return {
            value: `$${result.toFixed(2)}`,
            color: result >= 0 ? 'text-emerald-400' : 'text-red-500'
        };
    }, [pips, lotSize]);

    return (
        <CalculatorCard title="Profit / Loss Calculator" icon={ICONS.profitLoss}>
            <div className="space-y-4">
                <Input label="Pips Gained / Lost" type="number" value={pips} onChange={e => setPips(e.target.value)} placeholder="e.g., 50 or -25" />
                <Input label="Lot Size" type="number" value={lotSize} onChange={e => setLotSize(e.target.value)} placeholder="e.g., 0.10" />
                <ResultDisplay label="Profit / Loss" value={profitLoss.value} color={profitLoss.color} />
            </div>
        </CalculatorCard>
    );
};

const RiskRewardCalculator: React.FC = () => {
    const [stopLoss, setStopLoss] = useState('20');
    const [takeProfit, setTakeProfit] = useState('60');

    const ratio = useMemo(() => {
        const sl = parseFloat(stopLoss);
        const tp = parseFloat(takeProfit);
        if (isNaN(sl) || isNaN(tp) || sl <= 0) return 'Invalid';

        const rr = tp / sl;
        return `1 : ${rr.toFixed(2)}`;
    }, [stopLoss, takeProfit]);

    return (
        <CalculatorCard title="Risk/Reward Ratio" icon={ICONS.riskReward}>
            <div className="space-y-4">
                <Input label="Stop Loss (pips)" type="number" value={stopLoss} onChange={e => setStopLoss(e.target.value)} placeholder="e.g., 20" />
                <Input label="Take Profit (pips)" type="number" value={takeProfit} onChange={e => setTakeProfit(e.target.value)} placeholder="e.g., 60" />
                <ResultDisplay label="Risk to Reward Ratio" value={ratio} />
            </div>
        </CalculatorCard>
    );
};


const RiskCalculators: React.FC = () => {
    return (
        <div className="p-4 sm:p-6 md:p-8">
            <h2 className="text-3xl font-bold text-white mb-6">Forex Calculators</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                <LotSizeCalculator />
                <ProfitLossCalculator />
                <RiskRewardCalculator />
                <PipValueCalculator />
            </div>
        </div>
    );
};

export default RiskCalculators;
