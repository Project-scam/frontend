function ColorPicker({ colors, selectedColor, onSelect }) {
  return (
    <div className="colors-bomb">
      {colors.map((color, i) => (
        <div
          key={i}
          className={`color-btn-bomb ${selectedColor === i ? 'active' : ''}`}
          style={{ backgroundColor: color }}
          onClick={() => onSelect(i)}
        />
      ))}
    </div>
  );
}

export default ColorPicker;
