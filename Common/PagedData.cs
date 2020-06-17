using System;
using System.Collections.Generic;
using System.Linq;

namespace Kwetterprise.Frontend.Common
{
    public class PagedData<T>
    {
        public PagedData()
        {

        }

        public PagedData(int pageSize, int pageNumber, int totalCount, List<T> data)
        {
            this.PageSize = pageSize;
            this.PageNumber = pageNumber;
            this.TotalCount = totalCount;
            this.Data = data;
        }

        public int PageSize { get; set; }

        public int PageNumber { get; set; }

        public int TotalCount { get; set; }

        public List<T> Data { get; set; } = null!;

        public PagedData<TOut> Select<TOut>(Func<T, TOut> selector)
        {
            return new PagedData<TOut>(this.PageSize, this.PageNumber, this.TotalCount, this.Data.Select(selector).ToList());
        }
    }

    public class TimedData<T>
    {
        public TimedData()
        {
        }

        public TimedData(List<T> data, bool ascending, Guid? next)
        {
            this.Data = data;
            this.Ascending = ascending;
            this.Next = next;
        }

        public Guid? Next { get; set; }

        public bool Ascending { get; set; }

        public List<T> Data { get; set; } = null!;

        public TimedData<TOut> Select<TOut>(Func<T, TOut> selector)
        {
            return new TimedData<TOut>(this.Data.Select(selector).ToList(), this.Ascending, this.Next);
        }
    }
}