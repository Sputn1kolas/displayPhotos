library('ggplot2')
library("magrittr")
library("stringr")
library("dplyr")

library(lubridate)
library('forecast')
library('tseries')

#https://www.analyticsvidhya.com/blog/2015/12/complete-tutorial-time-series-modeling/
daily_data = read.csv('./Development/Pandemic/hell.csv', header=TRUE, stringsAsFactors=FALSE)
library(readr)

# this creates the times series features:
# time of day
# day of week
# month 
# day of year
# days from last podcast
# days from two podcasts last
hell$isoDate     <- as.POSIXct(hell$isoDate,origin="1970-01-01")
hell$dayOfWeek   <- weekdays(hell$isoDate)
hell$year        <- year(hell$isoDate)
hell$month       <- month(hell$isoDate)
hell$hour        <- hour(hell$isoDate)
hell$minuteOfDay <- hour(hell$isoDate)*60 + minute(hell$isoDate)
hell$dayFromLast <- 0
hell$dayFromLast[length(hell)] <- 0
for(i in 1:nrow(hell)-1) {
  hell$dayFromLast[i] <- as.numeric(hell$isoDate[i] - hell$isoDate[i+1])
}
hell$dayFromTwoLast <- 0
for(i in 1:nrow(hell)-2) {
  hell$dayFromTwoLast[i] <- as.numeric(hell$isoDate[i] - hell$isoDate[i+2])
}

# Plots the average days away
ggplot(hell, aes(hell$dayFromLast)) + geom_histogram()
ggplot(hell, aes(hell$isoDate, hell$dayFromLast, col = hell$dayFromLast)) + geom_point() + theme(legend.position="none")
ggplot(hell, aes(hell$isoDate, hell$dayFromLast, col = hell$dayFromLast)) + geom_line() + theme(legend.position="none")

# Plots the average time of day
ggplot(hell, aes(hell$hour)) + geom_histogram()
ggplot(hell, aes(hell$isoDate, hell$hour, col = hell$hour)) + geom_point() + theme(legend.position="none")

