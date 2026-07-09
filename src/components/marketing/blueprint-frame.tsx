// Marco tipo "blueprint" fijo con 4 ticks en las esquinas. Puramente
// decorativo (pointer-events:none), definido en elevated.css.
export function BlueprintFrame() {
  return (
    <div className="frame" aria-hidden="true">
      <i className="tick tl" />
      <i className="tick tr" />
      <i className="tick bl" />
      <i className="tick br" />
    </div>
  );
}
