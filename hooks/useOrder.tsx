"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import type { OrderState, OrderStep, PickupDetails } from "@/types/order";
import { getIngredient } from "@/data/ingredients";
import { getBroth } from "@/data/broths";

const STORAGE_KEY = "ropot.order.v1";

const initialState: OrderState = {
  brothId: null,
  spiceId: "medium",
  lines: [],
  step: "broth",
  details: { name: "", mobile: "", locationId: "adelaide-cbd", time: PICKUP_DEFAULT() },
  placed: false,
  orderRef: null,
};

function PICKUP_DEFAULT() {
  return "As soon as it's ready";
}

type Action =
  | { type: "setBroth"; brothId: string }
  | { type: "setSpice"; spiceId: string }
  | { type: "add"; ingredientId: string }
  | { type: "decrement"; ingredientId: string }
  | { type: "remove"; ingredientId: string }
  | { type: "setStep"; step: OrderStep }
  | { type: "setDetails"; details: Partial<PickupDetails> }
  | { type: "place"; ref: string }
  | { type: "reset" }
  | { type: "hydrate"; state: OrderState };

function reducer(state: OrderState, action: Action): OrderState {
  switch (action.type) {
    case "setBroth":
      return { ...state, brothId: action.brothId, placed: false };
    case "setSpice":
      return { ...state, spiceId: action.spiceId, placed: false };
    case "add": {
      const existing = state.lines.find(
        (line) => line.ingredientId === action.ingredientId,
      );
      const lines = existing
        ? state.lines.map((line) =>
            line.ingredientId === action.ingredientId
              ? { ...line, quantity: Math.min(9, line.quantity + 1) }
              : line,
          )
        : [...state.lines, { ingredientId: action.ingredientId, quantity: 1 }];
      return { ...state, lines, placed: false };
    }
    case "decrement": {
      const lines = state.lines
        .map((line) =>
          line.ingredientId === action.ingredientId
            ? { ...line, quantity: line.quantity - 1 }
            : line,
        )
        .filter((line) => line.quantity > 0);
      return { ...state, lines, placed: false };
    }
    case "remove":
      return {
        ...state,
        lines: state.lines.filter(
          (line) => line.ingredientId !== action.ingredientId,
        ),
        placed: false,
      };
    case "setStep":
      return { ...state, step: action.step };
    case "setDetails":
      return { ...state, details: { ...state.details, ...action.details } };
    case "place":
      return { ...state, placed: true, orderRef: action.ref };
    case "reset":
      return { ...initialState, lines: [] };
    case "hydrate":
      return action.state;
    default:
      return state;
  }
}

interface OrderContextValue {
  state: OrderState;
  setBroth: (id: string) => void;
  setSpice: (id: string) => void;
  addIngredient: (id: string) => void;
  decrementIngredient: (id: string) => void;
  removeIngredient: (id: string) => void;
  setStep: (step: OrderStep) => void;
  setDetails: (details: Partial<PickupDetails>) => void;
  placeOrder: () => string;
  reset: () => void;
  quantityOf: (id: string) => number;
  itemCount: number;
  ingredientsSubtotal: number;
  brothPrice: number;
  subtotal: number;
  prepMinutes: number;
  ready: boolean;
}

const OrderContext = createContext<OrderContextValue | null>(null);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [hydrated, setHydrated] = useState(false);

  // Restore any draft bowl on first mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<OrderState>;
      if (!parsed || typeof parsed !== "object") return;
      dispatch({
        type: "hydrate",
        state: {
          ...initialState,
          ...parsed,
          lines: Array.isArray(parsed.lines)
            ? parsed.lines.filter((line) => getIngredient(line.ingredientId))
            : [],
          details: { ...initialState.details, ...(parsed.details ?? {}) },
          // Never restore straight into a placed order.
          placed: false,
          orderRef: null,
        },
      });
    } catch {
      /* a corrupt draft is not worth breaking the page over */
    } finally {
      setHydrated(true);
    }
  }, []);

  // Never write before the draft has been read back, or the first render
  // would overwrite the saved bowl with an empty one.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* private browsing, quota, etc. */
    }
  }, [state, hydrated]);

  const quantityOf = useCallback(
    (id: string) =>
      state.lines.find((line) => line.ingredientId === id)?.quantity ?? 0,
    [state.lines],
  );

  const value = useMemo<OrderContextValue>(() => {
    const ingredientsSubtotal = state.lines.reduce((sum, line) => {
      const ingredient = getIngredient(line.ingredientId);
      return ingredient ? sum + ingredient.price * line.quantity : sum;
    }, 0);
    const brothPrice = getBroth(state.brothId)?.price ?? 0;
    const itemCount = state.lines.reduce((sum, line) => sum + line.quantity, 0);

    return {
      state,
      setBroth: (id) => dispatch({ type: "setBroth", brothId: id }),
      setSpice: (id) => dispatch({ type: "setSpice", spiceId: id }),
      addIngredient: (id) => dispatch({ type: "add", ingredientId: id }),
      decrementIngredient: (id) =>
        dispatch({ type: "decrement", ingredientId: id }),
      removeIngredient: (id) => dispatch({ type: "remove", ingredientId: id }),
      setStep: (step) => dispatch({ type: "setStep", step }),
      setDetails: (details) => dispatch({ type: "setDetails", details }),
      placeOrder: () => {
        const ref = `RP${Math.floor(1000 + (Date.now() % 9000))}`;
        dispatch({ type: "place", ref });
        return ref;
      },
      reset: () => dispatch({ type: "reset" }),
      quantityOf,
      itemCount,
      ingredientsSubtotal,
      brothPrice,
      subtotal: ingredientsSubtotal + brothPrice,
      // Eight minutes on the pass, plus a little for a heavily loaded bowl.
      prepMinutes: 8 + Math.min(12, Math.ceil(itemCount * 0.9)),
      ready: Boolean(state.brothId) && itemCount > 0,
    };
  }, [state, quantityOf]);

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
}

export function useOrder(): OrderContextValue {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used inside <OrderProvider>");
  }
  return context;
}
