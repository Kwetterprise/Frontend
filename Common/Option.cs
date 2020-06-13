using System;

namespace Kwetterprise.Frontend.Common
{
    public class Option
    {
        public Option()
        {

        }

        protected Option(string? error)
        {
            this.Error = error;
            this.HasFailed = error != null;
        }

        public string? Error { get; set; }

        public bool HasFailed { get; set; }

        public static Option Success => new Option(null);

        public static Option FromError(string error) => new Option(error);
    }

    public class Option<T> : Option
        where T : class
    {

        private Option(T? value, string? error)
            : base(error)
        {
            this.Value = value;
        }


        public T? Value { get; set; }

        public static Option<T> FromResult(T result) => new Option<T>(result, null);

        public new static Option<T> FromError(string e) => new Option<T>(null, e);

        public Option<TOut> CastError<TOut>()
            where TOut : class
        {
            if (this.HasFailed)
            {
                return Option<TOut>.FromError(this.Error!);
            }

            throw new InvalidOperationException("Cannot cast Some option.");
        }

        public Option<TOut> Select<TOut>(Func<T, TOut> selector)
            where TOut : class
        {
            return this.HasFailed
                ? Option<TOut>.FromError(this.Error!)
                : Option<TOut>.FromResult(selector(this.Value!));
        }

        public static implicit operator Option<T>(T value) => Option<T>.FromResult(value);
    }

    public static class OptionExtensions
    {
        public static Option<T> OrElse<T>(this T? source, string error) where T : class =>
            source is null ? Option<T>.FromError(error) : Option<T>.FromResult(source);

        public static Option<T> ToErrorResultOption<T>(this string source) where T : class => Option<T>.FromError(source);
    }
}
