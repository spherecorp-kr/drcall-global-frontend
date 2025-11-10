import { curveCardinal } from 'd3-shape';
import type { CurveType } from 'recharts/types/shape/Curve';

export const levelBadgeMap = {
	VIP: { level: 'vip' as const, label: 'VIP' },
	Risk: { level: 'risk' as const, label: 'Risk' },
};

export const LINE_CHART_CURVE: CurveType = curveCardinal.tension(1) as CurveType;

export const LINE_CHART_MARGIN = {
	bottom: 40,
	left: 0,
	right: 20,
	top: 20
};

export const YAXIS_TICK = { fill: '#acacac', textAnchor: 'end' };