export default function ProductRow({ name, price, stocked }) {
  return (
    <tr>
      <td
        className={`p-2 border-b border-b-grey-500 ${
          stocked ? "" : "text-red-500"
        }`}
      >
        {name}
      </td>
      <td className="p-2 border-b border-b-grey-500">{price}</td>
    </tr>
  );
}
