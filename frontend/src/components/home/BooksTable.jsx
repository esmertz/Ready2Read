const BooksTable = ({ books }) => {
    return (
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="border px-4 py-2">Title</th>
            <th className="border px-4 py-2">Author</th>
            <th className="border px-4 py-2">Description</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{book.volumeInfo.title}</td>
              <td className="border px-4 py-2">
                {book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown'}
              </td>
              <td className="border px-4 py-2">
                {book.volumeInfo.description ? book.volumeInfo.description.substring(0, 100) + '...' : 'No description available'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  
  export default BooksTable;
  