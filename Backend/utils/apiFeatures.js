class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search() {
    const keyword = this.queryString.keyword
      ? {
          name: {
            $regex: this.queryString.keyword,
            $options: 'i',
          },
        }
      : {};
    // console.log(keyword);
    this.query = this.query.find(keyword);
    return this;
  }

  filter() {
    // console.log(this.queryString.page);
    const queryStringCopy = { ...this.queryString };
    const excludedFields = ['sort', 'page', 'limit', 'fields', 'keyword']; // Thse fields must be excluded from query string
    excludedFields.forEach(keyWord => delete queryStringCopy[keyWord]);
    //  console.log(queryStringCopy);
    let formattedStr = JSON.stringify(queryStringCopy);
    formattedStr = formattedStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    // console.log('hello', JSON.parse(formattedStr));
    this.query = this.query.find(JSON.parse(formattedStr));
    return this;
  }

  paginate() {
    const currentPage = +this.queryString.page || 1;
    const dataPerPage = +this.queryString.limit || 10;
    const skip = dataPerPage * (currentPage - 1);
    this.query = this.query.limit(dataPerPage).skip(skip);
    return this;
  }
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else this.query = this.query.select('-__v');
    return this;
  }
}

module.exports = APIFeatures;
