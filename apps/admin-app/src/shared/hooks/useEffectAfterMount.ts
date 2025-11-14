import { useEffect, useRef } from "react";

type EffectCallback = () => void | (() => void | undefined);
type DependencyList = ReadonlyArray<unknown>;

// 첫 렌더링 시 useEffect 실행 방지
export const useEffectAfterMount = (func: EffectCallback, deps: DependencyList) => {
	const mounted = useRef(false);
	useEffect(() => {
		if (mounted.current) {
			func();
		} else {
			mounted.current = true;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps);
}