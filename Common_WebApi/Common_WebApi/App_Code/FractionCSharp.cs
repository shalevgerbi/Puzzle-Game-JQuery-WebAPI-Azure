using System;
using System.Collections.Generic;
/// using System.Linq;
using System.Web;

namespace Common_WebApi
{
   //////////////////// [Serializable]     DELETE
    public class FractionCSharp
    {
        public int num  { get; set; }
        public int denom { get; set; }
        public FractionCSharp()
        {
            num = 0; denom = 1;
        }
        public FractionCSharp(int n, int d)
        {
            num = n; denom = d;
        }
        public static FractionCSharp operator +(FractionCSharp A, FractionCSharp B)
        {
            return new FractionCSharp(
                A.num * B.denom + A.denom * B.num, A.denom * B.denom);
        }
        public static FractionCSharp operator -(FractionCSharp A, FractionCSharp B)
        {
            return new FractionCSharp(
                A.num * B.denom - A.denom * B.num, A.denom * B.denom);
        }

    }
}