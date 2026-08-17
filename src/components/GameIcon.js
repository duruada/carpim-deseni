import React from 'react';
import Svg, { Circle, G, Line, Path, Rect } from 'react-native-svg';

/**
 * Oyun ikonları. Dosya değil, geometri: her boyutta net kalıyor, oyunun
 * rengini alıyor ve pakete bir bayt görsel eklemiyor.
 *
 * Hepsi 24x24 kutuda, aynı çizgi kalınlığında — yan yana durduklarında
 * tek bir takım gibi görünsünler diye.
 */
export default function GameIcon({ name, color, size = 28 }) {
  const common = {
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    fill: 'none',
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {ICONS[name]?.(common, color) ?? null}
    </Svg>
  );
}

const ICONS = {
  /** Katlar: ızgarada yanan köşegen. Kareler ince ve az yuvarlak, yoksa
   *  28 piksele inince birbirine yapışıp lekeye dönüşüyor. */
  multiples: (c, color) => (
    <G>
      {[0, 1, 2].map((r) =>
        [0, 1, 2].map((k) => (
          <Rect
            key={`${r}-${k}`}
            x={3.5 + k * 6.5}
            y={3.5 + r * 6.5}
            width={4.5}
            height={4.5}
            rx={1}
            {...c}
            strokeWidth={1.6}
            fill={r === k ? color : 'none'}
          />
        ))
      )}
    </G>
  ),

  /** Çarpım tablosu: alan modeli — dolu dikdörtgen ve ızgara. */
  table: (c, color) => (
    <G>
      <Rect x={3} y={3} width={18} height={18} rx={2} {...c} />
      <Rect x={3} y={3} width={10} height={7} rx={1} fill={color} opacity={0.35} stroke="none" />
      <Line x1={9.5} y1={3} x2={9.5} y2={21} {...c} strokeWidth={1.2} />
      <Line x1={16} y1={3} x2={16} y2={21} {...c} strokeWidth={1.2} />
      <Line x1={3} y1={10} x2={21} y2={10} {...c} strokeWidth={1.2} />
      <Line x1={3} y1={15.5} x2={21} y2={15.5} {...c} strokeWidth={1.2} />
    </G>
  ),

  /** Sayı doğrusu: zıplama yayı üstte, çentikler altta. Çentikler yayın
   *  içinden geçerse ikisi de okunmuyor. */
  numberline: (c, color) => (
    <G>
      <Path d="M4 16 Q 8.5 5 13 16" {...c} />
      <Line x1={2} y1={16} x2={22} y2={16} {...c} />
      {[4, 8.5, 13, 17.5, 21].map((x) => (
        <Line key={x} x1={x} y1={16} x2={x} y2={18.5} {...c} strokeWidth={1.5} />
      ))}
      <Circle cx={13} cy={16} r={2} fill={color} stroke="none" />
    </G>
  ),

  /** Market: sepet. */
  market: (c) => (
    <G>
      <Path d="M8 8 V6.5 A4 4 0 0 1 16 6.5 V8" {...c} />
      <Path d="M3.5 8 H20.5 L18.8 19.5 A2 2 0 0 1 16.8 21 H7.2 A2 2 0 0 1 5.2 19.5 Z" {...c} />
      <Line x1={9.5} y1={12} x2={9.5} y2={17} {...c} strokeWidth={1.6} />
      <Line x1={14.5} y1={12} x2={14.5} y2={17} {...c} strokeWidth={1.6} />
    </G>
  ),

  /** Ayna çizim: kelebek. Simetriyi bir çocuğa anlatan en doğrudan şekil.
   *  Önce iki soyut şekil denendi ama eksende birleşip tek bir süs gibi
   *  görünüyorlardı — yansıma olduğu okunmuyordu. */
  mirror: (c, color) => (
    <G>
      <Path
        d="M12 12 C 6 2.5, 1 8, 5.5 12 C 1 16, 6 21.5, 12 12 Z"
        {...c}
        strokeWidth={1.8}
        fill={color}
        fillOpacity={0.28}
      />
      <Path
        d="M12 12 C 18 2.5, 23 8, 18.5 12 C 23 16, 18 21.5, 12 12 Z"
        {...c}
        strokeWidth={1.8}
        fill={color}
        fillOpacity={0.28}
      />
      <Line x1={12} y1={2} x2={12} y2={22} stroke={color} strokeWidth={1.6} strokeDasharray="2.5 2.5" />
    </G>
  ),

  /** Kesirler: altı dilimli pizza, ikisi dolu. Dört dilim (artı işareti)
   *  pizzadan çok hedef tahtasına benziyordu. */
  fraction: (c, color) => {
    const P = [
      [12, 2.5], [20.23, 7.25], [20.23, 16.75], [12, 21.5], [3.77, 16.75], [3.77, 7.25],
    ];
    return (
      <G>
        <Path d="M12 12 L12 2.5 A9.5 9.5 0 0 1 20.23 16.75 Z" fill={color} opacity={0.32} stroke="none" />
        <Circle cx={12} cy={12} r={9.5} {...c} />
        {P.map(([x, y], i) => (
          <Line key={i} x1={12} y1={12} x2={x} y2={y} {...c} strokeWidth={1.3} />
        ))}
      </G>
    );
  },

  /** Ölçüm avı: cetvel. */
  measure: (c) => (
    <G>
      <Rect x={2} y={7.5} width={20} height={9} rx={1.6} {...c} />
      {[6, 10, 14, 18].map((x, i) => (
        <Line key={x} x1={x} y1={7.5} x2={x} y2={i % 2 === 0 ? 13 : 11} {...c} strokeWidth={1.6} />
      ))}
    </G>
  ),

  /** Zar: iki zar. Oyun zaten iki zarla oynanıyor; önceki denemede yanına
   *  konan sütunlar küçükken kuyruk gibi görünüyordu. */
  dice: (c, color) => {
    const pips = (x0, y0, list) =>
      list.map(([px, py], i) => (
        <Circle
          key={`${x0}-${i}`}
          cx={x0 + 2.6 + px * 2.15}
          cy={y0 + 2.6 + py * 2.15}
          r={1.05}
          fill={color}
          stroke="none"
        />
      ));
    return (
      <G>
        <Rect x={2} y={5.5} width={9.5} height={9.5} rx={2} {...c} strokeWidth={1.8} />
        {pips(2, 5.5, [[0, 0], [2, 2]])}
        <Rect x={12.5} y={9} width={9.5} height={9.5} rx={2} {...c} strokeWidth={1.8} />
        {pips(12.5, 9, [[0, 0], [1, 1], [2, 2]])}
      </G>
    );
  },
};
