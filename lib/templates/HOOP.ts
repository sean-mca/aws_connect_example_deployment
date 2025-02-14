import { Construct } from "constructs";
import { aws_connect as connect } from 'aws-cdk-lib';


interface HoopProps {
    instanceArn: string,
    standardized: boolean,
    timezone: string,
    name: string,
    weekends?: boolean,
    standardized_start_hour?: number,
    standardized_start_minute?: number,
    standardized_end_hour?: number,
    starrdized_end_minutes?: number,
    manual_config?: connect.CfnHoursOfOperation.HoursOfOperationConfigProperty[]
};

const days_of_week = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

export class Hoop extends Construct {

    public hoop: connect.CfnHoursOfOperation;

    constructor(scope: Construct, id: string, props: HoopProps) {
        super(scope, id)

        if (props.standardized == true) {
            if (props.weekends == true) {

                const hoop = new connect.CfnHoursOfOperation(this, "ExampleHOOP", {
                    //@ts-ignore
                    config: days_of_week.map((day) => {
                        return {
                            day: day,
                            startTime: {
                                hours: props.standardized_start_hour,
                                minutes: props.standardized_start_minute
                            },
                            endTime: {
                                hours: props.standardized_end_hour,
                                minutes: props.starrdized_end_minutes
                            }
                        }
                    }),
                    instanceArn: props.instanceArn
                })

                this.hoop = hoop;
            } else if (props.weekends == false) {
                let new_list = days_of_week.slice(1, 6);

                const hoop = new connect.CfnHoursOfOperation(this, "ExampleHOOP", {
                    //@ts-ignore
                    config: new_list.map((day) => {
                        return {
                            day: day,
                            startTime: {
                                hours: props.standardized_start_hour,
                                minutes: props.standardized_start_minute
                            },
                            endTime: {
                                hours: props.standardized_end_hour,
                                minutes: props.starrdized_end_minutes
                            }
                        }
                    }),
                    instanceArn: props.instanceArn,
                    timeZone: props.timezone,
                    name: props.name
                });

                this.hoop = hoop;

            }
        } else {
            const hoop = new connect.CfnHoursOfOperation(this, "ExampleHOOP", {
                instanceArn: props.instanceArn,
                //@ts-ignore
                config: props.manual_config,
                timeZone: props.timezone,
                name: props.name
            });

            this.hoop = hoop;
        }


    }
}