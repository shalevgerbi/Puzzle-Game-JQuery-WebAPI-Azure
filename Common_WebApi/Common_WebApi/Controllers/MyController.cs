using System;
using System.Web.Http;
using System.Web.Http.Cors;



namespace Common_WebApi
{
    // http://localhost:50691/api/My?first=1&second=2&cmd=Plus    

    //TextAndColor hello = new TextAndColor();
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class MyController : ApiController
    {
        [HttpGet]
        [ActionName("shuffle")]
        public TextAndColor[] Shuffle_Server()
        {
            short i;
            int[] arr = new int[16];
            for (i = 0; i < 15; i++)
            {
                arr[i] = i + 1;
            }
            arr[15] = -1;

            Random myRand = new Random();
            for (i = 14; i > 0; i--)
            {
                int rand = myRand.Next(i);
                int temp = arr[i];
                arr[i] = arr[rand];
                arr[rand] = temp;
            }
            TextAndColor[] arrTextAndColor = new TextAndColor[15];
            for (i = 0; i < 15; i++)
            {
                arrTextAndColor[i] = new TextAndColor();

                arrTextAndColor[i].Text = arr[i].ToString();
                arrTextAndColor[i].R = myRand.Next(150, 255);
                arrTextAndColor[i].G = myRand.Next(150, 255);
                arrTextAndColor[i].B = myRand.Next(150, 255);

            }
            return arrTextAndColor;
        }
        // GET api/<controller>

        [HttpPost]
        [ActionName("currentStep")]
        public TextAndColor CurrentStep_Server(TextAndColor_Pushed_Empty cur_Pushe_Empty)
        {
            TextAndColor cur_Pushed = cur_Pushe_Empty.TextAndColor_Pushed;
            TextAndColor cur_Empty = cur_Pushe_Empty.TextAndColor_Empty;

            if (cur_Pushed == null || cur_Empty == null)
            {

                TextAndColor error = new TextAndColor();
                error.Text = "Error";
                error.R = -1;
                error.G = -1;
                error.B = -1;
                return error;
            }
            int i_1 = int.Parse(cur_Pushed.Text) % 4;
            int j_1 = int.Parse(cur_Pushed.Text) / 4;

            int i_2 = int.Parse(cur_Empty.Text) % 4;
            int j_2 = int.Parse(cur_Empty.Text) / 4;

            TextAndColor results = new TextAndColor();
            if (Math.Abs(i_1 - i_2) + Math.Abs(j_1 - j_2) != 1)
                results.Text = "false";
            else
            {
                if (i_1 > i_2)
                    results.Text = "Left";
                if (i_1 < i_2)
                    results.Text = "Right";
                if (j_1 > j_2)
                    results.Text = "Up";
                if (j_1 < j_2)
                    results.Text = "Down";
                results.R = (cur_Pushed.R + cur_Empty.R) / 2;
                results.G = (cur_Pushed.G + cur_Empty.G) / 2;
                results.B = (cur_Pushed.B + cur_Empty.B) / 2;

            }
            return results;
        }
        [HttpPost]
        [ActionName("isEnd")]
        public bool isEnd_Server(TextAndTabIndex[] curBoard)
        {
            int counter = 1;
            for (int i = 0; i < 15; i++)
            {
                if (i == 2)
                {
                    return true;
                }
                if (curBoard[i].Text != counter.ToString() || curBoard[i].TabIndex != i)
                {
                    return false;
                }
                counter++;

            }
            return true;

        }


    }


}